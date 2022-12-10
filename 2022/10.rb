module Day10
  class << self
    def part_one(input)
      cpu = CPU.new
      input.each do |line|
        cpu.execute_instruction(line)
      end
      signals = [
        cpu.get_signal(20),
        cpu.get_signal(60),
        cpu.get_signal(100),
        cpu.get_signal(140),
        cpu.get_signal(180),
        cpu.get_signal(220)
      ]
      puts signals
      signals.sum
    end

    def part_two(input)
      cpu = CPU.new
      input.each do |line|
        cpu.execute_instruction(line)
      end
      result = []
      1.step(240, 1) { |pixel_pos|
        if (cpu.register_X_history[pixel_pos] - ((pixel_pos-1) % 40)).abs < 2
          result.append("#")
        else
          result.append(".")
        end
      }
      print_result(result)
    end

    def print_result(result)
      result = result.join("")
      0.step(240, 40) { |row_start|
        puts result[row_start..row_start+39]
      }
    end
  end

  class CPU
    attr_accessor :cycle
    attr_accessor :register_X
    attr_accessor :register_X_history


    def initialize()
      @cycle = 0
      @register_X = 1
      @register_X_history = []
      update_history
      @cycle += 1
      update_history
    end

    def execute_instruction(instruction)
      if instruction.include?("noop")
        @cycle += 1
        update_history
      elsif instruction.include?("addx")
        @cycle += 1
        update_history
        @cycle += 1
        @register_X += instruction.split(' ')[1].to_i
        update_history
      end
    end

    def update_history
      puts "during cycle #{@cycle}, X is #{@register_X}"
      @register_X_history.append(@register_X)
    end

    def get_signal(during_cycle)
      @register_X_history[during_cycle] * during_cycle
    end
  end
end

lines = File.readlines("examples/10/101.txt")
puts Day10.part_one(lines)
puts Day10.part_two(lines)
lines = File.readlines("inputs/10.txt")
puts Day10.part_one(lines)
puts Day10.part_two(lines)
