  # Declarative way
  roundScores = []
  input1.each do |match|
    opponent = match[0]
    you = match[2]
    score = 0
    if you == "X" #rock
      score += 1
    elsif you == "Y" #paper
      score += 2
    else #scissors
      score += 3
    end
    if opponent == "A" #rock
      if you == "X" #rock
        # tie
        score += 3
      elsif you == "Y" #paper
        # win
        score += 6
      else #scissors
        # lose
      end
    elsif opponent == "B" #paper
      if you == "X" #rock
        # lose
      elsif you == "Y" #paper
        # tie
        score += 3
      else #scissors
        # win
        score += 6
      end
    else #Scissors
      if you == "X" #rock
        # win
        score += 6
      elsif you == "Y" #paper
        # lose
      else #scissors
        # tie
        score += 3
      end
    end
    roundScores.append(score)
  end

  puts "part1: "
  puts roundScores.sum()

  roundScores = []
  input1.each do |match|
    opponent = match[0]
    you = match[2]
    score = 0
    if opponent == "A" #rock
      if you == "X" #LOSE
        you = "Z" #Scissors
        score += 3
      elsif you == "Y" #DRAW
        you = "X" #rock
        score += 1
      else #WIN
        you = "Y" #Paper
        score += 2
      end
    elsif opponent == "B" #paper
      if you == "X" #LOSE
        you = "X" #rock
        score += 1
      elsif you == "Y" #DRAW
        you = "Y" #Paper
        score += 2
      else #WIN
        you = "Z" #Scissors
        score += 3
      end
    else #scissors
      if you == "X" #LOSE
        you = "Y" #Paper
        score += 2
      elsif you == "Y" #DRAW
        you = "Z" #Scissors
        score += 3
      else #WIN
        you = "X" #rock
        score += 1
      end
    end
    if opponent == "A" #rock
      if you == "X" #rock
        # tie
        score += 3
      elsif you == "Y" #paper
        # win
        score += 6
      else #scissors
        # lose
      end
    elsif opponent == "B" #paper
      if you == "X" #rock
        # lose
      elsif you == "Y" #paper
        # tie
        score += 3
      else #scissors
        # win
        score += 6
      end
    else #Scissors
      if you == "X" #rock
        # win
        score += 6
      elsif you == "Y" #paper
        # lose
      else #scissors
        # tie
        score += 3
      end
    end
    roundScores.append(score)
  end

  puts "part2: "
  puts roundScores.sum()
